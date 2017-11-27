class CompaniesController < ApplicationController

  def update
    @company = current_user.company || current_user.build_company
    if @company.update(company_params)
      return render json: @company
    else
      return render_create_error json: @company
    end
  end

  private

  def company_params
    params[:company].delete :size
    params[:company].delete :notes
    # FIXME

    params.require(:company).permit(:name, :url, :description, :location)
  end


end
