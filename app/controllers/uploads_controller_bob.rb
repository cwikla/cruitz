class UploadsController < ApplicationController
  def show
    render json: Upload.find(params[:id])
  end

  private

  def upload_params
    params.require(:upload).permit(:id)
  end


end
