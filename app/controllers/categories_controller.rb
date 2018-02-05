class CategoriesController < ApplicationController
  def index 
    render json: Category.categories
  end

  def search
    cp = cat_search_params

    results = Category.simple_search(cp)

    render json: results, root: :results, query: cp
  end

  private

  def cat_search_params
    params.require(:q)
  end

end
