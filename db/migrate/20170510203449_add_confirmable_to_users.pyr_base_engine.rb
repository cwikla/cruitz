# This migration comes from pyr_base_engine (originally 20140225201128)
class AddConfirmableToUsers < ActiveRecord::Migration
  # Note: You can't use change, as User.update_all with fail in the down migration
  def unused_change
    add_column :users, :confirmed_at, :timestamp
    add_column :users, :confirmation_token, :string
    add_column :users, :confirmation_sent_at, :timestamp
		add_column :users, :unconfirmed_email, :string

		add_index :users, [:unconfirmed_email]
  end
end
