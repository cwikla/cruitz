class HeadsController < ApplicationController
  def index
    render json: current_user.heads
  end

  def show
    the_head = Head.find(params[:id])
    the_head = nil if the_head.user_id != current_user.id
    render json: the_head
  end

  def create
    puts "LOOKIE I WANNA CREATE SOMETHING"
    puts params
  end

end
