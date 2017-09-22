class CreateInvites < ActiveRecord::Migration[5.1]
  def change
    create_table :invites do |t|
      t.timestamps
      t.timestamp :deleted_at
      t.timestamp :sent_at, null: false

      t.integer :user_id, null: false
      t.integer :invited_user_id

      t.string :first_name
      t.string :last_name
      t.string :email, null: false
      t.text :body

      t.boolean :use_default, null: false, default: true
    end

    add_index :invites, [:email]
    add_index :invites, [:user_id]
    add_index :invites, [:invited_user_id]
  end
end
