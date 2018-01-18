class UploadsController < Pyr::Base::UploadsController
  def show
    render json: Upload.find(params[:id])
  end

  private

end
