# This migration comes from pyr_base_engine (originally 20171220002157)
class CreateUploads < ActiveRecord::Migration[5.1]
  def change
    create_table :uploads do |t|
      t.timestamps
      t.integer :user_id, :null => false
      t.string :bucket_name, :null => false
      t.string :key, :null => false
      t.string :file_name, :null => false
      t.string :path, :null => false
      t.string :full_name, :null => false
      t.string :content_type, :null => false
      t.string :url, :null => false
      t.string :sub_type
    end

    add_index :uploads, [:user_id, :key, :url]
  end
end
