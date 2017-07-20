# This migration comes from pyr_base_engine (originally 20150915010224)
class CreatePyrBaseMagicKeys < ActiveRecord::Migration[5.1]
  def change
    create_table :pyr_base_magic_keys do |t|
      t.timestamps
      t.timestamp :deleted_at
      t.string :magic_key, :size => 16, :null => false
      t.integer :user_id, :null => false
      t.boolean :is_unused, :null => false, :default => true
      t.timestamp :used_at
    end

    add_index :pyr_base_magic_keys, [:magic_key, :user_id]
    add_index :pyr_base_magic_keys, [:user_id, :created_at]
  end
end
