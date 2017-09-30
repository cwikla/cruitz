class SearchController < ApplicationController
  def show
    return render json: { search: { results: [ params[:model] ] } }
  end

  private

  def search_params
    params.require(:search).permit(
      :model
    )
  end

end
