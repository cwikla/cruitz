class CreateUniversities < ActiveRecord::Migration[5.1]
  def change
    create_table :universities do |t|
      t.timestamps
      t.timestamp :deleted_at

      t.string :name, null: false
      t.integer :rank
    end

    add_index :universities, :rank
  end
end
