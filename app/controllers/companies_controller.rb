class CompaniesController < ApplicationController

  def update
    cp = company_params

    upload = current_user.uploads.where(full_name: cp[:logo]).first

    puts "CMPY UPDATE"
    puts cp.inspect
    cp[:logo] = upload
    puts cp.inspect

    @company = current_user.company || current_user.build_company
    if @company.update(cp)
      puts "#{@company.inspect}"
      result = render json: @company
      puts result
      return result
    else
      return render_create_error json: @company
    end
  end

  private

  def company_params
    params[:company].delete :size
    params[:company].delete :notes
    params[:company].delete :twitter
    params[:company].delete :linked_in
    params[:company].delete :facebook

    # FIXME

    params.require(:company).permit(:name, :url, :description, :location, :logo)
  end


end
