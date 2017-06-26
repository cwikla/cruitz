class Api::UsersController < Api::BaseController

  def index
    users = User.all

    render json: ActiveModel::ArraySerializer.new(users, each_serializer: Api::UserSerializer, root: 'users')
  end

  def show
    user = User.find(params[:id])

    render json: Api::V1::UserSerializer.new(user).to_json
  end

end
