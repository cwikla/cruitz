class CreateEmployers < ActiveRecord::Migration[5.0]
  def change
    create_table :employers do |t|
      t.timestamps
      t.timestamp :deleted_at

      t.integer :user_id
    end

    add_index :employers, [:user_id]
  end
end
