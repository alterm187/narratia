declare module '@mailchimp/mailchimp_marketing' {
  interface Config {
    apiKey?: string;
    accessToken?: string;
    server?: string;
  }

  interface SetConfigOptions {
    apiKey?: string;
    accessToken?: string;
    server?: string;
  }

  interface MergeFields {
    [key: string]: string | number | boolean;
  }

  interface Tag {
    name: string;
    status: 'active' | 'inactive';
  }

  interface AddListMemberBody {
    email_address: string;
    status: 'subscribed' | 'unsubscribed' | 'cleaned' | 'pending';
    merge_fields?: MergeFields;
    tags?: string[];
  }

  interface ListMember {
    id: string;
    email_address: string;
    unique_email_id: string;
    status: string;
    merge_fields: MergeFields;
    tags: Tag[];
  }

  interface ListStats {
    member_count: number;
    open_rate: number;
    click_rate: number;
  }

  interface List {
    id: string;
    name: string;
    stats: ListStats;
  }

  interface UpdateListMemberTagsBody {
    tags: Tag[];
  }

  interface Lists {
    addListMember(
      listId: string,
      body: AddListMemberBody
    ): Promise<ListMember>;

    getListMember(
      listId: string,
      subscriberHash: string
    ): Promise<ListMember>;

    updateListMemberTags(
      listId: string,
      subscriberHash: string,
      body: UpdateListMemberTagsBody
    ): Promise<void>;

    getList(listId: string): Promise<List>;
  }

  interface Mailchimp {
    lists: Lists;
    setConfig(config: SetConfigOptions): void;
  }

  const mailchimp: Mailchimp;
  export default mailchimp;
}
