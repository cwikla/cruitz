class SkillsController < ApplicationController
  def search
    query = skill_search_params

    results = Skill.simple_search(query)

    render json: results, root: :results, query: query
  end

  private

  def skill_search_params
    params.require(:q)
  end
end

