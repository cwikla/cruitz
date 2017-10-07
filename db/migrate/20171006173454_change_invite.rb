class ChangeInvite < ActiveRecord::Migration[5.1]
  def change
    remove_index :invites, [:invited_user_id]
    rename_column :invites, :invited_user_id, :from_user_id
    add_index :invites, [:from_user_id]
  end
end
