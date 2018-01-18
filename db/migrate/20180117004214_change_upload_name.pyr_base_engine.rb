# This migration comes from pyr_base_engine (originally 20180117004115)
class ChangeUploadName < ActiveRecord::Migration[5.1]
  def self.up
    rename_table :uploads, :pyr_base_uploads
  end

  def self.down
    rename_table :pyr_base_uploads, :uploads
  end
end
