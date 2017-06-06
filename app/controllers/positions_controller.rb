class PositionsController < ApplicationController

  def new
    @position = Position.new
  end

  def create
    current_user.positions.create(position_params)
  end

  private

  def position_params
    params(:position).permit(:title, :description)
  end
end
