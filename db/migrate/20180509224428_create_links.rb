class CreateLinks < ActiveRecord::Migration[5.1]
  def change
    create_table :links do |t|
      t.timestamps
      t.timestamp :deleted_at
      t.text :url, null: false
      t.integer :ltype, null: false, default: 0
      t.string :description
    end
  end
end
