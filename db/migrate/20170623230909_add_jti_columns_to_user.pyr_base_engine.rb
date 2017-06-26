# This migration comes from pyr_base_engine (originally 20170623230640)
class AddJtiColumnsToUser < ActiveRecord::Migration[5.0]
  def up
    add_column :users, :jti, :string

		User.reset_column_information

    # If you already have user records, you will need to initialize its `jti` column before setting it to not nullable. Your migration will look this way:
    User.all.each { |user| user.update_column(:jti, SecureRandom.uuid) }
    change_column_null :users, :jti, false
    add_index :users, :jti, unique: true
  end

  def down
    remove_index :users, :jti
    remove_column :users, :jti, :string
  end
end
