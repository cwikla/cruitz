class CompaniesController < ApplicationController

  def mine
    render json: current_user.company
  end

  def show
    render json: Company.find(params[:id])
  end

  def mine_update
    cp = company_params

    loc_ids = cp.delete(:locations)
    logo_id = cp.delete(:logo)

    @company = current_user.company || current_user.build_company

    logo = nil
    logo = Upload.find_safe(logo_id)
    cp[:logo] = logo
    
    locations = []
    locations = GeoName.find(loc_ids) if loc_ids
    cp[:locations] = locations

    begin
      Company.transaction(requires_new: true) do
        @company.update!(cp)
      end

      return render json: @company

    rescue => e
      puts "E: #{e.inspect}"
      puts "ERROR: #{@company.errors.inspect}"

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

    params.require(:company).permit(:name, :url, :description, :logo, locations: [])
  end


end
