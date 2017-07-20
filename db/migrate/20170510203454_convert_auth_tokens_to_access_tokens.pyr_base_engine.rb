# This migration comes from pyr_base_engine (originally 20150717234114)
class ConvertAuthTokensToAccessTokens < ActiveRecord::Migration[5.1]
  def up
    remove_index :auth_tokens, [:token, :user_id]

    rename_table :auth_tokens, :access_tokens
    add_column :access_tokens, :api_key_id, :integer
    remove_column :access_tokens, :uuid
    add_index :access_tokens, :token, :unique => true
  end

  def down
    remove_index :access_tokens, :token

    rename_table :access_tokens, :auth_tokens
    add_column :access_tokens, :uuid, :string, :limit => 36, :null => false, :unique => true
    remove_column :access_tokens, :api_key_id

    add_index :auth_tokens, [:token, :user_id], :unique => true
  end
end
