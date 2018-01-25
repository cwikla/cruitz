class CreateSkills < ActiveRecord::Migration[5.1]
  def change
    create_table :skills do |t|
      t.timestamps
      t.timestamp :deleted_at

      t.string :name, null: false
    end

    add_index :skills, :name, unique: true
  end
end
