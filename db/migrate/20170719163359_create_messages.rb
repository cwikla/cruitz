class CreateMessages < ActiveRecord::Migration[5.1]
  def change
    create_table :messages do |t|
      t.timestamps
      t.timestamp :deleted_at
      t.timestamp :read_at

      t.integer :user_id, :null => false
      t.integer :from_user_id, :null => false
      t.integer :job_id, :null => false
      t.integer :candidate_id

      t.integer :root_message_id   # root
      t.integer :parent_message_id # parent

      t.text :title
      t.text :body
    end

    add_index :messages, [:user_id, :job_id, :candidate_id]
    add_index :messages, [:from_user_id, :job_id, :candidate_id]
    add_index :messages, [:candidate_id]
    add_index :messages, [:root_message_id]
    add_index :messages, [:job_id]
  end
end
