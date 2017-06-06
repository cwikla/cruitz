class CreateRatings < ActiveRecord::Migration[5.0]
  def change
    create_table :ratings do |t|
      t.timestamps
      t.timestamp :deleted_at

      t.integer :user_id, :null => false
      t.integer :recruiter_id, :null => false
    end

    add_index :ratings, [:user_id, :recruiter_id]
  end
end
