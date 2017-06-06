class CreateHeads < ActiveRecord::Migration[5.0]
  def change
    create_table :heads do |t|
      t.timestamps
      t.timestamp :deleted_at

      t.integer :recruiter_id, :null => false

      t.string :first_name
			t.string :last_name
			t.string :email
			t.string :phone_number
    end

    add_index :heads, [:recruiter_id]
  end
end
