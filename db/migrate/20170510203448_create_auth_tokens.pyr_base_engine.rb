# This migration comes from pyr_base_engine (originally 20140217231011)
class CreateAuthTokens < ActiveRecord::Migration[5.1]
  def up
    create_table :auth_tokens do |t|
      t.timestamps
      t.timestamp :deleted_at
      t.integer   :user_id, :null => false
      t.string    :token, :limit => 64, :null => false
      t.string    :uuid, :limit => 36, :null => false
      t.timestamp :last_accessed_at
    end

    add_index :auth_tokens, [:token, :user_id], :unique => true
    add_index :auth_tokens, [:uuid], :unique => true
    add_index :auth_tokens, [:last_accessed_at]

    User.find_each do |u|
      if u.respond_to?(:authentication_token)
        next if u.authentication_token.nil?

        at = u.auth_tokens.build(:token => u.authentication_token)
        at.save!
      end
    end

    remove_column :users, :authentication_token
  end

  def down
    add_column :users, :authentication_token, :string

    User.find_each do |u|
      one = u.auth_tokens.first
      if one
        u.authentication_token = one.token
        u.save
      end
    end

    drop_table :auth_tokens
  end
end
