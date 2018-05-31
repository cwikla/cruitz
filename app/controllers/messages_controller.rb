class MessagesController < ApplicationController
  LIMIT = 50
  def index
    @threads = Message.threads_for(current_user)

    render json: @threads
  end

  def show
    mid = params[:id]
    @message = Message.find_for(current_user, mid)

    render json: @message #, current_user: current_user
  end

  def thread
    mid = params[:id]
    @message = Message.find_for(current_user, mid)

     ReadThreadJob.mark(@message)
    
    render json: @message.thread #, current_user: current_user
  end

  def new
    @message = Message.new
  end

  def create
    request.headers.each do |k,v|
      puts "HEADER: #{k} => #{v}"
    end
    puts "DATA: #{request.params}"

    mid = hid()
    @parentMessage = Message.last_for(current_user, mid)

    puts "GOT PARENT MSG: #{@parentMessage.id}"

    @message = @parentMessage.reply_from(current_user)
    @message.body = message_params[:body].blank? ? nil : message_params[:body]
    
    if @message.save
      return render json: @message #, current_user: current_user
    else
      return render_create_error json: @message #, current_user: current_user
    end
  end

  def update
    mid = hid()
    @message = Message.last_for(current_user, mid)
    if @message.update(message_params)
      return render json: @message #, current_user: current_user
    else
      return render_create_error json: @message #, current_user: current_user
    end
  end


  def lsearch
    result = GeoName.search(params[:term]).map(&:name)
    puts "***** RESULT #{result}"
    render json: result #, current_user: current_user
  end

  private

  def message_params
    params.require(:message).permit(:body, :id)
  end
end
