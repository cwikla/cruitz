class CreateHeadLinks < ActiveRecord::Migration[5.1]
  def change
    create_table :head_links do |t|
      t.timestamps
      t.timestamp :deleted_at
      t.integer :head_id, null: false
      t.integer :link_id, null: false
    end

    add_index :head_links, :head_id
    add_index :head_links, :link_id
  end
end
