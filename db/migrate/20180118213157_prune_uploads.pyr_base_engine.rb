# This migration comes from pyr_base_engine (originally 20180118212446)
class PruneUploads < ActiveRecord::Migration[5.1]
  def up
    remove_column :pyr_base_uploads, :key
    remove_column :pyr_base_uploads, :path
    remove_column :pyr_base_uploads, :full_name
    remove_column :pyr_base_uploads, :url

    add_column :pyr_base_uploads, :uuid, :string, :limit => 36, :unique => true
    add_column :pyr_base_uploads, :deleted_at, :timestamp

    add_index :pyr_base_uploads, [:user_id]
  end

  def down
    remove_index :pyr_base_uploads, [:user_id]

    remove_column :pyr_base_uploads, :uuid
    remove_column :pyr_base_uploads, :deleted_at

    add_column :pyr_base_uploads, :key, :string
    add_column :pyr_base_uploads, :path, :string
    add_column :pyr_base_uploads, :full_name, :string
    add_column :pyr_base_uploads, :url, :string

    add_index :pyr_base_uploads, [:user_id, :key, :url]
  end
end
