class HeadsController < ApplicationController
  def index
    render json: current_user.heads
  end

  def show
    head = Head.find(params[:id])
    head = nil if head.user_id != current_user.id
    render json: head
  end

end
