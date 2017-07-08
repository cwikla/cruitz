class JobSerializer < ActiveModel::Serializer
  
  attribute :id
  attributes  :id,
              :uuid,
              :title, 
							:description, 
							:time_commit, 
							:location

end
