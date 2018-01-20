class AddUploadIdToUser < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :pyr_upload_id, :integer
    
    add_index :users, :pyr_upload_id
  end
end
