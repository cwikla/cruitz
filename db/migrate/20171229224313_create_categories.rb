class CreateCategories < ActiveRecord::Migration[5.1]
  def change
    create_table :categories do |t|
      t.timestamps
      t.timestamp :deleted_at
      t.integer :parent_id
      t.integer :syn_id
      t.string :name, :null => false
    end

    add_index :categories, :name
  end
end
