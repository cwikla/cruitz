# This migration comes from pyr_base_engine (originally 20130111173532)
class AddRolesMaskToUsers < ActiveRecord::Migration
  def change
    add_column :users, :roles_mask, :integer
    add_column :users, :admin_roles_mask, :integer
  end
end
