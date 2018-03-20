class CompaniesController < ApplicationController

  def mine
    render json: current_user.company
  end

  def show
    render json: Company.find(params[:id])
  end

  def mine_update
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

  def search
    query = company_search_params

    results = Company.simple_search(query)

    render json: results, root: :results, query: query
  end

  private

  def company_search_params
    params.require(:q)
  end

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
