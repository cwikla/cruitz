class CreateReviews < ActiveRecord::Migration[5.1]
  def change
    create_table :reviews do |t|
      t.timestamps
      t.timestamp :deleted_at

      t.integer :user_id, :null => false
      t.integer :from_user_id, :null => false
      t.integer :score, :null => false, :default => 0
      t.string :description
    end

    add_index :reviews, [:user_id, :score]
    add_index :reviews, [:from_user_id, :score]
  end
end
