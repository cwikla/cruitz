# This migration comes from pyr_base_engine (originally 20140407190334)
class AddPhotoUrlToUsers < ActiveRecord::Migration[5.1]
  def change
    # don't do this anymore
    #add_column :users, :photo_url, :text
  end
end
