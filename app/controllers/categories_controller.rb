class CategoriesController < ApplicationController
  def index 
    render json: Category.categories
  end
end
