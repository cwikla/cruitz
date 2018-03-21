# This migration comes from pyr_base_engine (originally 20180321004217)
class AddPathToUploads < ActiveRecord::Migration[5.1]
  def up
    add_column :pyr_base_uploads, :path, :string

    Upload.reset_column_information

    Upload.update_all("path = uuid")
  end

  def down
    remove_column :pyr_base_uploads, :path
  end
end
