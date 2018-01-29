class SkillsController < ApplicationController
  def search
    query = search_params

    results = Skill.search(query)

    render json: results, root: :results, query: query
  end

  private

  def search_params
    params.require(:q)
  end
end

