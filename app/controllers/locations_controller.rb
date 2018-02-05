class LocationsController < ApplicationController
  def search
    lp = locations_search_params

    results = GeoName.search(lp) #.map{ |x| [x.id, [x.name, x.admin_code_1 || x.admin_name_1].join(", ")]}.uniq
    #puts "***** RESULT #{results}"
    render json: results, root: :results, query: lp
  end

  private

  def locations_search_params
    params.require(:q)
  end
end
