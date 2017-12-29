class MessagesController < ApplicationController
  def index
    mjson = current_user.roots[0..20] # FIXME Message.roots(Message.all_for(current_user))
    render json: mjson
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
    @parentMessage = Message.for(current_user, mid)

    puts "GOT PARENT MSG: #{@parentMessage.id}"

    @message = @parentMessage.reply_from(current_user)
    @message.body = message_params[:body].blank? ? nil : message_params[:body]
    
    if @message.save
      return render json: @message
    else
      return render_create_error json: @message
    end
  end

  def update
    mid = hid()
    @message = Message.for(current_user, mid)
    if @message.update(message_params)
      return render json: @message
    else
      return render_create_error json: @message
    end
  end

  def show
    mid = hid()
    @message = Message.find(mid)
    @message = nil if @message.user_id != current_user.id
    @thread = nil

    if @message
      @thread = @message.thread()
    end

    mjson = MessageSerializer.new(@message)
    tjson = ActiveModel::Serializer::CollectionSerializer.new(@thread)

    ReadThreadJob.mark(@message)

    render json: @message, thread: true
  end

  def lsearch
    result = GeoName.search(params[:term]).map(&:name)
    puts "***** RESULT #{result}"
    render json: result
  end

  private

  def message_params
    params.require(:message).permit(:body)
  end
end
