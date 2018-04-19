class CreateSpams < ActiveRecord::Migration[5.1]
  def change
    create_table :spams do |t|
      t.timestamps
      t.timestamp :deleted_at
      t.integer :user_id, null: false
      t.integer :recruiter_id, null: false
      t.integer :reason_id, null: false
      t.integer :candidate_id
      t.integer :message_id
    end

    add_index :spams,[:user_id, :recruiter_id], unique: true
    add_index :spams,[:recruiter_id]

    add_index :spams,[:candidate_id]
    add_index :spams, [:message_id]
  end
end
