class MessagesController < ApplicationController
  def index
    render json: (params[:sent] ? current_user.sent_messages : current_user.messages).order(:id).all
  end

  def new
    @message = Message.new
  end

  def create
    request.headers.each do |k,v|
      puts "HEADER: #{k} => #{v}"
    end

    @message = current_user.messages.build(message_params)
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

    render json: @message, cand: params[:cand]
  end

  def lsearch
    result = GeoName.search(params[:term]).map(&:name)
    puts "***** RESULT #{result}"
    render json: result
  end

  private

  def message_params
    params.require(:message).permit(:title, :description, :location, :time_commit)
  end
end
