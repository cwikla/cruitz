class MessagesController < ApplicationController
  def index
    render json: current_user.messages #(params[:sent] ? current_user.sent_messages : current_user.messages).order(:id)
  end

  def new
    @message = Message.new
  end

  def create
    request.headers.each do |k,v|
      puts "HEADER: #{k} => #{v}"
    end

    @parentMessage = Message.message_for_user(current_user, params[:id])

    @message = @parentMessage.reply_from(current_user)
    @message.body = message_params[:body].blank? ? nil : message_params[:body]
    
    if @message.save
      return render json: @message
    else
      return render_create_error json: @message
    end
  end

  def update
    @message = current_user.messages.find(params[:id])
    if @message.update(message_params)
      return render json: @message
    else
      return render_create_error json: @message
    end
  end

  def show
    @message = current_user.messages.find(params[:id])
    @thread = nil

    if @message
      @thread = @message.thread()
    end

    mjson = MessageSerializer.new(@message)
    tjson = ActiveModel::Serializer::ArraySerializer.new(@thread)

    ReadThreadJob.mark(@thread)

    render json: {message: mjson, thread: tjson}
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
