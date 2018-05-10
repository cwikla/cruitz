class CreateHeadUploads < ActiveRecord::Migration[5.1]
  def change
    create_table :head_uploads do |t|
      t.timestamps
      t.timestamp :deleted_at
      t.integer :head_id, null: false
      t.integer :upload_id, null: false
    end

    add_index :head_uploads, :head_id
    add_index :head_uploads, :upload_id
  end
end
