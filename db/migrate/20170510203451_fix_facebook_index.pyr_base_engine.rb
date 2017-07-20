# This migration comes from pyr_base_engine (originally 20140708193910)
class FixFacebookIndex < ActiveRecord::Migration[5.1]
  def up
    remove_index :users,  [:facebook_id, :deleted_at]
    add_index :users,  [:facebook_id], :unique => true
  end

  def down
    add_index :users,  [:facebook_id, :deleted_at], :unique => true
  end
end
