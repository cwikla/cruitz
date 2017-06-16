class JobSerializer < ActiveModel::Serializer
  attributes  :id, 
              :title, 
							:description, 
							:time_commit, 
							:location

end
