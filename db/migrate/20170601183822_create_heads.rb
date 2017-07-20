class CreateHeads < ActiveRecord::Migration[5.0]
  def change
    create_table :heads do |t|
      t.timestamps
      t.timestamp :deleted_at

      t.integer :user_id, :null => false

      t.string :first_name
			t.string :last_name
			t.string :email
			t.string :phone_number
    end

    add_index :heads, [:user_id]
    add_index :heads, [:email]
    add_index :heads, [:phone_number]
    add_index :heads, [:last_name, :first_name]
  end
end
