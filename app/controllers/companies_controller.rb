class CompaniesController < ApplicationController

  def show
    render json: current_user.company
  end

  def update
    cp = company_params

    if cp[:logo] # should refactor this out
      upload = Upload.find(cp[:logo])
      if upload.user_id == current_user.id  # make sure it's owned 
        puts "CMPY UPDATE"
        puts upload.inspect
        cp[:logo] = upload
        puts cp.inspect
      end
    end

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
