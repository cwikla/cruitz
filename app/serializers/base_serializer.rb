class BaseSerializer < ActiveModel::Serializer
  def current_user
    instance_options[:current_user]
  end
end
