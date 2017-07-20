# This migration comes from pyr_base_engine (originally 20130821212129)
class AddTokenAuthenticatableToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :authentication_token, :string
    add_index :users, [:authentication_token], :name => :auth_idx
  end
end
