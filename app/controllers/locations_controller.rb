class LocationsController < ApplicationController
  def search
    results = GeoName.search(locations_params) #.map{ |x| [x.id, [x.name, x.admin_code_1 || x.admin_name_1].join(", ")]}.uniq
    puts "***** RESULT #{results}"
    render json: results, root: :results
  end

  private

  def locations_params
    params.require(:q)
  end
end
